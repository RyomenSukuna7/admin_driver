import { Redirect } from 'expo-router';

// Enter and Update are now one screen; this keeps old links working.
export default function UpdateTab() {
  return <Redirect href="/" />;
}
