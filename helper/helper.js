// role guard used as middleware
export const roleGuard = (role) => (context) => {
  /*
  here we need the isStaff param and the context.$auth.user.is_staff to be match
  say true and true for an admin, or false and false for a user
  otherwise, the user is not authorized to access that page, so maybe we redirect them
  to error page or home page
   */
  console.log(role)
  console.log(context.$auth.user)
  if (
    !(
      (context.$auth.user.is_staff && role === 'admin') ||
      (!context.$auth.user.is_staff && role === 'user')
    )
  ) {
    return context.redirect('/')
  }
}
