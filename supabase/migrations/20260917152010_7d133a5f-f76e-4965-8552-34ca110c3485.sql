drop policy if exists "report_files_read" on storage.objects;
drop policy if exists "report_files_write" on storage.objects;

create policy "report_files_read"
on storage.objects for select
to authenticated
using (
  bucket_id = 'reports'
  and public.can_access_patient((split_part(name, '/', 1))::uuid)
);

create policy "report_files_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'reports'
  and public.can_edit_patient((split_part(name, '/', 1))::uuid)
);

create policy "report_files_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'reports'
  and public.can_edit_patient((split_part(name, '/', 1))::uuid)
)
with check (
  bucket_id = 'reports'
  and public.can_edit_patient((split_part(name, '/', 1))::uuid)
);

create policy "report_files_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'reports'
  and public.can_edit_patient((split_part(name, '/', 1))::uuid)
);