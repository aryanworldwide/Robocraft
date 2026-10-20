import { useNavigate, useLocation } from 'react-router-dom';

const ROOT_PATHS = ['/', '/learn', '/projects', '/progress', '/lab', '/settings', '/mentor', '/search'];

const PARENT_MAP = [
  { prefix: '/lesson', parent: '/learn' },
  { prefix: '/quiz', parent: '/learn' },
  { prefix: '/project', parent: '/projects' },
];

export function useBackStack() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const isRoot = ROOT_PATHS.includes(pathname);
  const parentEntry = PARENT_MAP.find(entry => pathname.startsWith(entry.prefix));
  const parentPath = parentEntry?.parent || '/';

  const canGoBack = !isRoot;

  const goBack = () => {
    // Only go back if the previous page is inside the app; opened from a shared
    // link there is no in-app history, so go to the parent screen instead.
    if ((window.history.state?.idx ?? 0) > 0) {
      navigate(-1);
    } else {
      navigate(parentPath);
    }
  };

  return { canGoBack, goBack, isRoot, parentPath };
}
