import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

async function saveUserData(userData) {
  try {
    await addDoc(collection(db, "users"), {
      name: userData.name,
      age: userData.age,
      height: userData.height,
      weight: userData.weight,
      bmi: userData.bmi,
      calories: userData.calories,
      goal: userData.goal,
      createdAt: new Date()
    });
    alert("Data saved to Firebase!");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export default function UserForm() {
  const [user, setUser] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    bmi: "",
    calories: "",
    goal: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveUserData(user);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" onChange={(e) => setUser({ ...user, name: e.target.value })} />
      <input type="number" placeholder="Age" onChange={(e) => setUser({ ...user, age: e.target.value })} />
      <button type="submit">Save</button>
    </form>
  );
}