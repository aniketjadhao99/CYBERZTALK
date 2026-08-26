# Expert Profile Schema

This is the first basic data layer for separate victim and expert experiences.

## User account

The existing `User` model remains responsible for login and account identity:

- `fullName`
- `email`
- `password` (hashed)
- `phone`
- `location`
- `role`: `victim`, `expert`, or `admin`
- `avatar`

## Expert profile

Each expert can have one profile connected to their user account through `user`.

| Field | Type | Purpose |
| --- | --- | --- |
| `user` | User reference | Connects the profile to the expert account |
| `headline` | String | Short professional title |
| `bio` | String | Simple introduction and experience summary |
| `specialties` | Array | Areas such as phishing, fraud, forensics, or malware |
| `yearsOfExperience` | Number | Professional experience |
| `credentials` | Array | Certifications, qualifications, or training |
| `languages` | Array | Languages the expert can use with victims |
| `location` | String | General location |
| `avatar` | String | Profile image URL |
| `availability` | String | `available`, `busy`, or `offline` |
| `isPublic` | Boolean | Whether victims can view the profile |
| `isApproved` | Boolean | Whether the profile is approved for platform use |

## Planned access flow

1. A person chooses `Victim` or `Expert` during account creation.
2. Login reads the account role and opens the matching interface.
3. Victims can view approved, public expert profiles.
4. Experts can create and update their own profile.
5. Admin approval remains available before an expert profile is shown publicly.

The next step can add the role choice and separate redirects while keeping this schema unchanged.
