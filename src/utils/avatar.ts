// import Unknown from '../assets/images/avatar/unknown.png';
import Male from '../assets/images/avatar/male.png';
// import Female from '../assets/images/avatar/female.png';

export default function getAvatar(avatar: string | undefined) {
  // const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return avatar || Male;
}
