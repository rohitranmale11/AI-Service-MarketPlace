export default function UserAvatar({ user, className = 'h-10 w-10' }) {
  return (
    <div className={`${className} flex items-center justify-center overflow-hidden rounded-full bg-gray-200`}>
      {user?.profileImage ? (
        <img
          src={user.profileImage}
          alt="profile"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-sm font-semibold text-gray-600">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </span>
      )}
    </div>
  );
}
