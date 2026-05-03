# NYSC Passport Finder - Vercel MVP

## Features
- Admin creates Year / Batch / Stream / Platoon.
- Admin uploads passport ZIP.
- Parser detects properly named passport files and raw camera files like `DSC_6641.JPG`.
- Students search inside batch or globally.
- Students correct details or claim unassigned raw photos.
- Input validation for name, state code, file number and Nigerian phone number.
- IP-based edit cooldown.
- Admin can adjust cooldown settings per batch.
- Admin can approve pending edits.
- Admin can bulk-download ZIP with clean final filenames.

## Filename format
`FULL NAME STATECODE=FILENUMBER= PHONE.JPG`

Example:
`ABBAS IBRAHIM UMAR KG2026A=1589= 08143018538.JPG`

## Vercel setup
1. Upload this project to GitHub.
2. Import it into Vercel.
3. Add environment variables:
   - `ADMIN_KEY` = any private password you choose
   - `BLOB_READ_WRITE_TOKEN` = create from Vercel Storage > Blob
4. Deploy.
5. Open `/admin`, enter your `ADMIN_KEY`, create batch, upload ZIP.

## Important
Free Vercel serverless storage is not permanent. This project uses Vercel Blob for uploaded images and JSON data persistence, so you must enable Vercel Blob storage.
