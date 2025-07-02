-- Create storage bucket for document templates
INSERT INTO storage.buckets (id, name, public) VALUES ('document-templates', 'document-templates', false);

-- Create policies for document templates storage
CREATE POLICY "Allow authenticated users to view template files"
ON storage.objects FOR SELECT
USING (bucket_id = 'document-templates');

CREATE POLICY "Allow authenticated users to upload template files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'document-templates');

CREATE POLICY "Allow authenticated users to update template files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'document-templates');

CREATE POLICY "Allow authenticated users to delete template files"
ON storage.objects FOR DELETE
USING (bucket_id = 'document-templates');

-- Update document_templates table RLS policies to allow full management
DROP POLICY IF EXISTS "Allow authenticated users to view templates" ON public.document_templates;

CREATE POLICY "Allow authenticated users to manage templates"
ON public.document_templates FOR ALL
USING (true);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_document_templates_updated_at
BEFORE UPDATE ON public.document_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();