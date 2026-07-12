-- Close the public-bucket privacy hole: images were readable by anyone with
-- the URL, not just their owner. Make the bucket private and require the
-- owner's own JWT (via a short-lived signed URL) to view any file.
update storage.buckets set public = false where id = 'images';

drop policy if exists "Anyone can view images (public bucket)" on storage.objects;

create policy "Users can view their own images"
  on storage.objects for select
  using (
    bucket_id = 'images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
