
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PerformanceReview, Goal } from '@/types';
import { Target, Star, Plus, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';

interface PerformanceManagementProps {
  employeeId: string;
  isManager?: boolean;
}

// Mock performance data
const mockReviews: PerformanceReview[] = [
  {
    id: '1',
    employeeId: '101',
    reviewerId: '201',
    period: '2024 Q4',
    goals: [
      {
        id: '1',
        title: 'Complete React Migration',
        description: 'Migrate legacy components to React',
        targetDate: '2024-12-31',
        status: 'completed',
        rating: 5,
        comments: 'Exceeded expectations'
      },
      {
        id: '2',
        title: 'Improve Code Quality',
        description: 'Reduce technical debt and improve test coverage',
        targetDate: '2024-12-15',
        status: 'in-progress',
        rating: 4
      }
    ],
    overallRating: 4.5,
    comments: 'Strong performance with excellent technical skills',
    status: 'completed',
    createdDate: '2024-10-01',
    completedDate: '2024-12-20'
  }
];

const PerformanceManagement: React.FC<PerformanceManagementProps> = ({
  employeeId,
  isManager = false
}) => {
  const [reviews, setReviews] = useState<PerformanceReview[]>(mockReviews);
  const [isNewGoalDialogOpen, setIsNewGoalDialogOpen] = useState(false);
  const [isNewReviewDialogOpen, setIsNewReviewDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: ''
  });
  const [newReview, setNewReview] = useState({
    period: '',
    comments: ''
  });

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const handleAddGoal = () => {
    if (!newGoal.title.trim() || !newGoal.description.trim() || !newGoal.targetDate) {
      toast.error('Please fill in all fields');
      return;
    }

    const goal: Goal = {
      id: `${Date.now()}`,
      title: newGoal.title,
      description: newGoal.description,
      targetDate: newGoal.targetDate,
      status: 'not-started'
    };

    // Add to current review or create new one
    const currentReview = reviews.find(r => r.status === 'draft');
    if (currentReview) {
      setReviews(reviews.map(r => 
        r.id === currentReview.id 
          ? { ...r, goals: [...r.goals, goal] }
          : r
      ));
    } else {
      const review: PerformanceReview = {
        id: `${Date.now()}`,
        employeeId,
        reviewerId: 'current-manager',
        period: new Date().getFullYear().toString(),
        goals: [goal],
        overallRating: 0,
        comments: '',
        status: 'draft',
        createdDate: new Date().toISOString().split('T')[0]
      };
      setReviews([review, ...reviews]);
    }

    setNewGoal({ title: '', description: '', targetDate: '' });
    setIsNewGoalDialogOpen(false);
    toast.success('Goal added successfully');
  };

  const handleStartReview = () => {
    if (!newReview.period.trim()) {
      toast.error('Please specify the review period');
      return;
    }

    const review: PerformanceReview = {
      id: `${Date.now()}`,
      employeeId,
      reviewerId: 'current-manager',
      period: newReview.period,
      goals: [],
      overallRating: 0,
      comments: newReview.comments,
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setReviews([review, ...reviews]);
    setNewReview({ period: '', comments: '' });
    setIsNewReviewDialogOpen(false);
    toast.success('Performance review started');
  };

  const updateGoalStatus = (reviewId: string, goalId: string, status: Goal['status']) => {
    setReviews(reviews.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          goals: review.goals.map(goal =>
            goal.id === goalId ? { ...goal, status } : goal
          )
        };
      }
      return review;
    }));
    toast.success('Goal status updated');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Performance Management
            </CardTitle>
            <div className="flex items-center gap-2">
              <Dialog open={isNewGoalDialogOpen} onOpenChange={setIsNewGoalDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Goal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Goal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="goalTitle">Goal Title</Label>
                      <Input
                        id="goalTitle"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                        placeholder="Enter goal title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="goalDescription">Description</Label>
                      <Textarea
                        id="goalDescription"
                        value={newGoal.description}
                        onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                        placeholder="Describe the goal in detail"
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetDate">Target Date</Label>
                      <Input
                        id="targetDate"
                        type="date"
                        value={newGoal.targetDate}
                        onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddGoal}>Add Goal</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {isManager && (
                <Dialog open={isNewReviewDialogOpen} onOpenChange={setIsNewReviewDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Start Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Start Performance Review</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="reviewPeriod">Review Period</Label>
                        <Input
                          id="reviewPeriod"
                          value={newReview.period}
                          onChange={(e) => setNewReview({...newReview, period: e.target.value})}
                          placeholder="e.g., 2024 Q1, Annual 2024"
                        />
                      </div>
                      <div>
                        <Label htmlFor="reviewComments">Initial Comments</Label>
                        <Textarea
                          id="reviewComments"
                          value={newReview.comments}
                          onChange={(e) => setNewReview({...newReview, comments: e.target.value})}
                          placeholder="Initial review comments (optional)"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleStartReview}>Start Review</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No performance reviews</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{review.period} Review</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Created: {new Date(review.createdDate).toLocaleDateString()}
                        </span>
                        {review.completedDate && (
                          <span>Completed: {new Date(review.completedDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={review.status === 'completed' ? 'default' : 'secondary'}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </Badge>
                      {review.overallRating > 0 && (
                        <div className="flex items-center gap-1">
                          {getRatingStars(review.overallRating)}
                          <span className="text-sm text-gray-600 ml-1">
                            ({review.overallRating}/5)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {review.comments && (
                    <p className="text-gray-700 italic">"{review.comments}"</p>
                  )}

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Goals</h4>
                    {review.goals.length === 0 ? (
                      <p className="text-gray-500 text-sm">No goals set for this review</p>
                    ) : (
                      review.goals.map((goal) => (
                        <div key={goal.id} className="border rounded p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">{goal.title}</h5>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(goal.status)} variant="outline">
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(goal.status)}
                                  {goal.status.charAt(0).toUpperCase() + goal.status.slice(1).replace('-', ' ')}
                                </div>
                              </Badge>
                              {goal.rating && (
                                <div className="flex items-center gap-1">
                                  {getRatingStars(goal.rating)}
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{goal.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                            {review.status === 'draft' && (
                              <Select
                                value={goal.status}
                                onValueChange={(value: Goal['status']) =>
                                  updateGoalStatus(review.id, goal.id, value)
                                }
                              >
                                <SelectTrigger className="w-32 h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="not-started">Not Started</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                          {goal.comments && (
                            <p className="text-xs text-gray-600 italic mt-1">"{goal.comments}"</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceManagement;
