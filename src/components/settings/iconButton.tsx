import ButtonBase from '@mui/material/ButtonBase'
import Avatar from '@mui/material/Avatar'

// import type { SchoolLogoState } from '@/services/store/school_logo'

// import useSchoolLogoStore from '@/services/store/school_logo'

export default function IconButton({
  type,
}: {
  type: 'avatar' | 'schoolLogo'
}) {
  /* this for school logo */
  // const schoolLogoSrc = useSchoolLogoStore(
  //   (state: SchoolLogoState) => state.schoolLogoSrc,
  // )
  // const setSchoolLogoSrc = useSchoolLogoStore(
  //   (state: SchoolLogoState) => state.setSchoolLogoSrc,
  // )

  return (
    <ButtonBase
      component="label"
      role={undefined}
      tabIndex={-1}
      aria-label={type === 'avatar' ? 'Avatar image' : 'School logo image'}
      sx={{
        borderRadius: type === 'avatar' ? '50%' : 12,
        '&:has(:focus-visible)': {
          outline: '2px solid',
          outlineOffset: '2px',
        },
      }}
    >
      <Avatar
        variant={type === 'avatar' ? 'circular' : 'rounded'}
        alt={type === 'avatar' ? 'Upload new avatar' : 'Upload school logo'}
        // src={type === 'avatar' ? avatarSrc : schoolLogoSrc}
        sx={{
          width: type === 'avatar' ? 90 : 128,
          height: type === 'avatar' ? 90 : 128,
        }}
      />
      <input
        type="file"
        accept="image/*"
        style={{
          border: 0,
          clip: 'rect(0 0 0 0)',
          height: '1px',
          margin: '-1px',
          overflow: 'hidden',
          padding: 0,
          position: 'absolute',
          whiteSpace: 'nowrap',
          width: '1px',
        }}
        // onChange={handleAvatarChange}
      />
    </ButtonBase>
  )
}
