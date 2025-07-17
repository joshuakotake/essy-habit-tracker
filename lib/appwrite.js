import { Client, Account, Databases } from "react-native-appwrite";

export const client = new Client();

client
  .setEndpoint("https://syd.cloud.appwrite.io/v1")
  .setProject("68768649002384fb423c")
  .setPlatform("com.joshua.essy");

export const account = new Account(client);
export const databases = new Databases(client);
