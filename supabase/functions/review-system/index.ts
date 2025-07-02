import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReviewData {
  employeeId: string;
  reviewerId: string;
  period: string;
  comments: string;
  overallRating: number;
  goals: Array<{
    title: string;
    description: string;
    targetDate: string;
    rating?: number;
    comments?: string;
  }>;
  peerReviewers?: string[];
  selfAssessment?: {
    strengths: string;
    areasForImprovement: string;
    achievements: string;
    goals: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, ...data } = await req.json();

    console.log('Processing review system action:', action);

    switch (action) {
      case 'create_360_review':
        const reviewData = data as ReviewData;
        
        // Create performance review
        const { data: review, error: reviewError } = await supabase
          .from('performance_reviews')
          .insert({
            employee_id: reviewData.employeeId,
            reviewer_id: reviewData.reviewerId,
            period: reviewData.period,
            comments: reviewData.comments,
            overall_rating: reviewData.overallRating,
            status: 'draft'
          })
          .select()
          .single();

        if (reviewError) {
          throw reviewError;
        }

        // Create performance goals
        const goalPromises = reviewData.goals.map(goal => 
          supabase.from('performance_goals').insert({
            title: goal.title,
            description: goal.description,
            target_date: goal.targetDate,
            rating: goal.rating,
            comments: goal.comments,
            status: 'not-started'
          }).select().single()
        );

        const goalResults = await Promise.all(goalPromises);
        const goals = goalResults.map(result => result.data).filter(Boolean);

        // Link goals to review
        if (goals.length > 0) {
          const goalLinkPromises = goals.map(goal => 
            supabase.from('performance_review_goals').insert({
              review_id: review.id,
              goal_id: goal.id
            })
          );

          await Promise.all(goalLinkPromises);
        }

        // Create peer review requests if specified
        if (reviewData.peerReviewers && reviewData.peerReviewers.length > 0) {
          const peerReviewPromises = reviewData.peerReviewers.map(peerId => 
            supabase.from('performance_reviews').insert({
              employee_id: reviewData.employeeId,
              reviewer_id: peerId,
              period: reviewData.period,
              comments: 'Peer review - pending completion',
              status: 'draft',
              overall_rating: null
            })
          );

          await Promise.all(peerReviewPromises);

          // Send notifications to peer reviewers
          const notificationPromises = reviewData.peerReviewers.map(peerId => 
            supabase.from('notifications').insert({
              recipient_id: peerId,
              sender_id: reviewData.reviewerId,
              type: 'info',
              message: `You have been requested to provide a peer review for employee ${reviewData.employeeId}`,
              link: `/performance/peer-review/${review.id}`
            })
          );

          await Promise.all(notificationPromises);
        }

        return new Response(JSON.stringify({
          success: true,
          reviewId: review.id,
          goalsCreated: goals.length,
          peerReviewsCreated: reviewData.peerReviewers?.length || 0
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'submit_self_assessment':
        const { employeeId, period, selfAssessment } = data;

        // Check if self-assessment already exists
        const { data: existingAssessment } = await supabase
          .from('performance_reviews')
          .select('id')
          .eq('employee_id', employeeId)
          .eq('reviewer_id', employeeId)
          .eq('period', period)
          .single();

        if (existingAssessment) {
          // Update existing self-assessment
          const { error: updateError } = await supabase
            .from('performance_reviews')
            .update({
              comments: JSON.stringify(selfAssessment),
              status: 'submitted'
            })
            .eq('id', existingAssessment.id);

          if (updateError) throw updateError;
        } else {
          // Create new self-assessment
          const { error: createError } = await supabase
            .from('performance_reviews')
            .insert({
              employee_id: employeeId,
              reviewer_id: employeeId,
              period: period,
              comments: JSON.stringify(selfAssessment),
              status: 'submitted',
              overall_rating: null
            });

          if (createError) throw createError;
        }

        return new Response(JSON.stringify({
          success: true,
          message: 'Self-assessment submitted successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'get_review_analytics':
        const { period: analyticsPeriod } = data;

        // Get review statistics
        const { data: reviews, error: reviewsError } = await supabase
          .from('performance_reviews')
          .select('overall_rating, status, employee_id, reviewer_id')
          .eq('period', analyticsPeriod);

        if (reviewsError) throw reviewsError;

        const analytics = {
          totalReviews: reviews?.length || 0,
          completedReviews: reviews?.filter(r => r.status === 'completed').length || 0,
          averageRating: reviews?.filter(r => r.overall_rating)
            .reduce((acc, r) => acc + (r.overall_rating || 0), 0) / 
            (reviews?.filter(r => r.overall_rating).length || 1),
          ratingDistribution: {
            excellent: reviews?.filter(r => r.overall_rating >= 4.5).length || 0,
            good: reviews?.filter(r => r.overall_rating >= 3.5 && r.overall_rating < 4.5).length || 0,
            satisfactory: reviews?.filter(r => r.overall_rating >= 2.5 && r.overall_rating < 3.5).length || 0,
            needsImprovement: reviews?.filter(r => r.overall_rating < 2.5 && r.overall_rating > 0).length || 0
          }
        };

        return new Response(JSON.stringify({
          success: true,
          analytics
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in review system:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});