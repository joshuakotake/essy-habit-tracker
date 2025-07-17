import { Redirect } from "expo-router";
import ThemedLoader from "../components/ThemedLoader";
import { useUser } from "../hooks/useUser";

export default function Index() {
  const { user, authChecked } = useUser();

  if (!authChecked) return <ThemedLoader />;

  if (!user) return <Redirect href="/login" />;

  return <Redirect href="/habits" />;
}
