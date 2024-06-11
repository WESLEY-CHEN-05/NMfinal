import { ADD_DRIVER } from "../graphql/mutation";
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
/*
export function useSignIn(){
    const [getID] = useLazyQuery(PLAYERID_QUERY);
    const [getPlayer] = useLazyQuery(PLAYER_QUERY);
    const [updateSignedIn] = useMutation(UPDATESIGNEDIN_MUTATION);
    return async function(email, password){
        let data,err;
        try{
            ({data,error:err} = await getID({variables:{email}}));
            // console.log(data);
            if(err)throw err;
        }catch(err){ 
            let type;
            if(err.message.includes(':')){
                const m=err.message;
                type = m.substring(0,m.indexOf(':'));
                // console.error(type);
            }
            return {state:'error', err, type};
        }
        try{
            const encryptPassword = AES.encrypt(password, 'webProgramming123').toString();
            const {data:result} = await updateSignedIn({variables:{playerID:data.playerID, state:true, password:encryptPassword}});

            const {data:{player}} = await getPlayer({variables:{ID:result?.updateSignedIn}});
            // console.log(result);
            // console.log({state:'success',player:{ID:result?.updateSignedIn,...player}});
            return {state:'success',player:{ID:result?.updateSignedIn,...player}};
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

