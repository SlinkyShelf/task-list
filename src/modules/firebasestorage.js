import { deleteObject } from "firebase/storage";
import { auth, db } from "./firebase-auth";
import { collection, setDoc, getDocs, getDoc, doc } from "firebase/firestore";

const storeData = async (coll, key, value) => {
    try {
      await setDoc(new doc(new collection(db, coll), key), value)
    } catch (e) {
      console.log(e)
    }
  }

  const getJsonData = async (coll, key, def) => {
    def = def || {}
    try {
      const docsnap = await getDoc(new doc(new collection(db, coll), key))
      console.log(docsnap.data())
      return docsnap.data() || def
    } catch(e) {
      console.log(e)
    }
  }


export { storeData, getJsonData }