import { ADD_DRIVER, UPDATESIGNEDIN_MUTATION} from "../graphql/mutation";
import { GET_DRIVER_BY_EMAIL } from "../graphql/query";
import { useMutation,useLazyQuery } from "@apollo/client";
import AES from 'crypto-js/aes';

export function useSignUp(){
    const [addDriver] = useMutation(ADD_DRIVER);
    
    return async function(identity, firstName, lastName, DIDid, email, password){
        try{
            const encryptPassword = AES.encrypt(password, 'NMfinalalalala').toString();
            console.log({firstName, lastName, DIDid, email, password});
            const {data} = await addDriver({variables:{firstName, lastName, DIDid, email, password: encryptPassword}});
            return {state:'success',data:data?.addDriver};
        }catch(error){
            console.log(error.message);
            return { state:'error', err:error.message };
        }
    }
}

export function useSignIn(){
    const [getDriverByEmail] = useLazyQuery(GET_DRIVER_BY_EMAIL);
    const [updateSignedIn] = useMutation(UPDATESIGNEDIN_MUTATION);
    return async function(identity, email, password){
        let data,err;
        console.log(identity, email, password);
        try{
            ({data, error:err} = await getDriverByEmail({variables:{email}}));
            
            if (err) throw err;
        }catch(err){ 
            return {state:'error', err};
        }
        try{
            const encryptPassword = AES.encrypt(password, 'NMfinalalalala').toString();
            const {data:result} = await updateSignedIn({variables:{identity, state:true, email,  password:encryptPassword}});

            // console.log(result);
            // console.log({state:'success',player:{ID:result?.updateSignedIn,...player}});
            return {state:'success', driver: result};
        }catch(err){
            console.log(err.message);
            return {state:'error', err: err.message };
        }
    }
}
/*
export function useSignOut(){
    const [updateSignedIn] = useMutation(UPDATESIGNEDIN_MUTATION);
    return async function(playerID){
        try{
            // console.log(playerID)
            const {data:result} = await updateSignedIn({variables:{playerID, state:false}});
            return {state:'success', playerID:result?.updateSignedIn};
        }catch(err){
            let type;
            if(err.message.includes(':')){
                const m=err.message;
                type = m.substring(0,m.indexOf(':'));
                // console.error(type);
            }
            return {state:'error', err, type};
        }
    }
}

export function useCheckSignIn(){
    const [getPlayer] = useLazyQuery(PLAYER_QUERY,{fetchPolicy:'network-only'});
    return async function(playerID){
        let player, error,data;
        try{
            ({data, error} = await getPlayer({variables:{ID:playerID}}));
            player = data?.player;
            if (error) throw error;
            return {state:'success',result:player?.signedIn};
        }catch(err){
            let type;
            if(err.message.includes(':')){
                const m=err.message;
                type = m.substring(0,m.indexOf(':'));
                // console.error(type);
            }
            return {state:'error', err, type};
        }
    }
}*/

