import { ADD_DRIVER } from "../graphql/mutation";
import { useMutation } from "@apollo/client";

export function useApply(){
    const [addDriver] = useMutation(ADD_DRIVER);
    return async function({ DIDid, name, licenseNumber, dueDate, email}){
        try{
            const {data} = await addDriver({variables:{DIDid, name, licenseNumber, dueDate, email}});
            return {state:'success',data:data?.addDriver};
        }catch(error){
            console.log(error.message);
            return { state:'error', err:error.message };
        }
    }
}