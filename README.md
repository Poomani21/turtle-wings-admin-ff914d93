# Turtle Wings Admin

# Continue and Complete My Existing Turtle Wings GitHub Project

My existing GitHub repository is:

https://github.com/Poomani21/turtle-wings-admin.git

Another AI already started modifying this project and stopped in the middle.

**DO NOT rebuild the project. DO NOT start from scratch. DO NOT replace Firebase.**

First inspect the current repository and continue from the code that is already implemented.

## Current partially completed work

Already implemented:

* `src/lib/cms.ts`

  * `fetchPublicMembers()`
  * Blog sorting improvements
  * Resumable Firebase Storage uploads
  * Upload progress
  * `validateUpload()`
  * `storageFolder()`
  * Image limit: 8 MB
  * Video limit: 200 MB
* `src/components/admin/MediaUpload.tsx`

  * Choose/replace file
  * Upload progress
  * Image/video preview
  * Success/error states
  * Existing HTTPS URLs still supported
* `src/components/admin/CollectionAdmin.tsx`

  * MediaUpload integration was started but currently has build errors.

## FIRST — fix the build

Open:

`src/components/admin/CollectionAdmin.tsx`

Add:

```ts
import { MediaUpload } from "@/components/admin/MediaUpload";
```

Fix the upload callback typing:

```ts
(url: string)
```

Remove obsolete imports/state such as:

* old `uploadFile`
* old `Loader2` if unused
* old `onUpload`
* old `uploading` state

Then run the build and make sure the project is green before doing anything else.

---

# 1. Public Members

Create:

`src/routes/members.tsx`

Use the existing:

```ts
fetchPublicMembers()
```

from the existing `members` Firestore collection.

Only show:

```text
isPublic == true
```

Add **Members** to the existing website navigation.

Do not hard-code members.

Use the existing Turtle Wings design.

Make the Members page responsive on desktop/tablet/mobile.

---

# 2. CRITICAL — Fix Blog completely

The Blog currently has a serious dynamic-content problem.

### Current behavior

Sometimes the Admin Panel blog appears correctly.

But sometimes:

* Firebase blogs do not appear
* Static/old blog content appears instead
* Hard reload causes Firebase blogs to disappear
* Normal navigation can also show static content
* Direct `/blog` access can behave differently
* The Admin Panel blog is therefore NOT reliably reflected on the public website

This must be completely fixed.

## Firebase must be the source of truth

The public Blog must always use:

```text
Admin Panel
↓
Firestore blogs
↓
isPublished == true
↓
Public Blog
```

Do NOT allow static `site-content.ts` blog data to override Firebase data.

Search the entire project for:

```text
site-content.ts
initialData
blog posts
static blog
fallback blog
mock blog
hard-coded blog
```

Find every place where static blog content is being used.

If static content exists only as demo/fallback content, it must NOT replace or override Firebase content.

Do not blindly delete it. Keep appropriate loading/empty/error behavior.

---

## Fix React Query

Inspect:

`src/routes/blog.index.tsx`

The existing issue is:

```ts
initialData: []
```

combined with:

```ts
staleTime: 60_000
```

This can cause React Query to treat the empty array as fresh.

Fix this properly.

Either remove:

```ts
initialData: []
```

or use:

```ts
initialDataUpdatedAt: 0
```

Use the cleanest approach for the existing architecture.

---

## Verify `fetchPublishedBlogs()`

Make sure it correctly reads:

```text
blogs
```

with:

```text
isPublished == true
```

Verify the fields used by the public Blog match the existing `BlogDoc`:

* title
* slug
* content
* excerpt
* image
* published date
* `isPublished`
* createdAt
* updatedAt
* other existing fields

Do not create a new Blog schema.

---

## Test Blog in ALL situations

You must test:

### Normal navigation

```text
Home → Blog
```

Firebase blog posts must appear.

### Hard reload

Open:

```text
/blog
```

then:

```text
Ctrl + Shift + R
```

Firebase blog posts must still appear.

### Direct URL

Open `/blog` directly in a new browser tab.

Firebase blogs must appear.

### After Admin creates a blog

```text
Admin Panel
→ Add Blog
→ Publish
→ Open public Blog
```

The new blog must appear.

### After editing

Admin edits blog → save → public Blog must show updated content.

### Publish/unpublish

```text
isPublished = true
```

must show publicly.

```text
isPublished = false
```

must remain hidden.

### Refresh repeatedly

Refresh the Blog page multiple times.

The result must remain consistent.

There must NEVER be a situation where static content appears after refresh while Firebase content disappears.

---

# 3. Firebase Rules

The admin architecture uses:

```text
admins/{uid}
```

Admin UID:

```text
7IEaaUx6WfRu4lHuX20ThknBBqn1
```

Do not replace the authentication system.

Update Firestore rules so public members can be read when:

```text
resource.data.isPublic == true || isAdmin()
```

Admins must retain write access.

Review:

* admins
* programs
* members
* blogs
* videos
* enquiries
* settings

Do not make Firestore globally writable.

---

# 4. Firebase Storage

The new MediaUpload system uses Firebase Storage.

Support:

```text
images/**
videos/**
```

Public website must be able to display appropriate uploaded public media.

Only administrators should be able to upload/update/delete CMS media.

Do NOT make Storage globally writable.

Existing external HTTPS URLs must continue working.

---

# 5. Global Site Settings

The following currently contain hard-coded contact information:

* Header
* Footer
* CtaBand
* `Sections.tsx`
* duplicate CtaBand in `index.tsx`
* InquiryForm
* any other components containing phone/WhatsApp/email

They must use the existing:

```ts
useSiteContact()
```

and existing:

```text
settings/site
```

Firebase document.

If the admin changes:

* Phone
* WhatsApp
* Email
* Address
* other supported contact information

the change must reflect EVERYWHERE on the website.

Search the entire project for hard-coded phone numbers, WhatsApp numbers and email addresses.

Do not create another settings system.

---

# 6. Contact map

Below the existing Contact page content, add a full-width responsive map.

Use:

```text
settings.mapEmbedUrl
```

Do NOT hard-code the map.

Keep:

* Existing Contact content
* WhatsApp
* Location
* QR functionality

Make the map responsive and prevent horizontal overflow.

If no map URL exists, show a graceful empty state instead of a broken iframe.

---

# 7. Admin Panel design

The Admin Panel works functionally but its design does not match the website.

Improve its visual design using the existing Turtle Wings:

* Colors
* Typography
* Buttons
* Cards
* Border radius
* Spacing
* Design language

Improve:

* Navigation
* Dashboard
* Forms
* Tables
* Add/edit pages
* Media upload UI
* Settings
* Loading states
* Empty states
* Error states

Do NOT make it look like a generic SaaS dashboard.

Do NOT remove existing working functionality.

---

# 8. Responsive design

Perform a complete responsive pass.

Test:

```text
1920px
1440px
1024px
768px
390px
375px
```

Pay special attention to:

* Videos
* Video cards
* Members
* Blog cards
* Program cards
* Header
* Mobile navigation
* Hero
* Contact
* Map
* Footer
* Images
* Firebase-hosted videos

Fix:

* Horizontal overflow
* Fixed widths
* Broken grids
* Incorrect video aspect ratios
* Cropped videos/images
* Mobile navigation overflow
* Excessive spacing
* Text wrapping

Do not redesign the website.

---

# 9. Media upload

Verify every media-enabled Admin Panel section:

* Programs
* Members
* Blog
* Videos
* Site Settings
* Homepage/content sections

Admin should be able to:

```text
Choose local file
↓
Upload to Firebase Storage
↓
Show progress
↓
Show preview
↓
Save Firebase Storage URL
↓
Website displays it
```

No manual HTTPS URL should be required for new uploads.

Existing HTTPS URLs must continue working.

---

# 10. Final build/test

Run:

```text
npm run build
```

Fix ALL TypeScript/import/build errors.

Then verify:

### Admin

* Login
* Dashboard
* Members CRUD
* Blog CRUD
* Blog publishing
* Video CRUD
* Image upload
* Video upload
* Site Settings

### Website

* Members navigation
* Members page
* Public members
* Blog listing
* Blog detail
* Blog after normal navigation
* Blog after hard reload
* Blog after direct URL
* Newly published blog
* Videos
* Uploaded images
* Uploaded videos
* Global phone
* Global WhatsApp
* Global email
* Contact map
* Desktop responsive
* Mobile responsive
* No horizontal overflow
* No console errors

### Firebase

Keep:

```text
Firestore
├── admins
├── programs
├── members
├── blogs
├── videos
├── enquiries
└── settings
    └── site

Storage
├── images/
└── videos/
```

Do not create duplicate collections.

Do not create duplicate Firebase initialization.

## Important

Continue from the current repository state.

Do NOT:

* Rebuild from scratch
* Replace Firebase
* Replace authentication
* Create duplicate collections
* Remove WhatsApp
* Remove QR/location features
* Remove working CRUD
* Use mock data
* Hard-code members/blogs/videos
* Make Firestore globally writable
* Make Storage globally writable

Fix the build first.

Then complete each remaining task one by one.

After completing everything, report:

1. Files changed
2. Features completed
3. Firestore rule changes
4. Storage rule changes
5. Manual Firebase Console actions required
6. Build result
7. Any remaining issues

Do not stop halfway. Continue until all items above are completed and the build is working.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a2c292cd-4a67-42ce-8ab4-6c7f42c9c8b9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
