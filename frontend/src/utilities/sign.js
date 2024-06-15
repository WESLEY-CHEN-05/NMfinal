import { ADD_DRIVER, ADD_PASSENGER, ADD_ISSUER, UPDATESIGNEDIN_MUTATION} from "../graphql/mutation";
import { GET_DRIVER_BY_EMAIL, GET_PASSENGER_BY_EMAIL, GET_ISSUER_BY_EMAIL } from "../graphql/query";
import { useMutation,useLazyQuery } from "@apollo/client";
import AES from 'crypto-js/aes';

export function useSignUp(){
    const [addDriver] = useMutation(ADD_DRIVER);
    const [addPassenger] = useMutation(ADD_PASSENGER);
    const [addIssuer] = useMutation(ADD_ISSUER);
    return async function({identity, firstName, lastName, DIDid, email, password}){
        try{
            const encryptPassword = AES.encrypt(password, 'NMfinalalalala').toString();
            console.log({firstName, lastName, DIDid, email, password});
            if (identity === "driver") {
                const {data} = await addDriver({variables:{firstName, lastName, DIDid, email, password: encryptPassword}});
                return {state:'success',data:data?.addDriver};
            } else if (identity === "issuer") {
                const {data} = await addIssuer({variables:{firstName, lastName, DIDid, email, password: encryptPassword}});
                return {state:'success',data:data?.addIssuer};
            } else {
                const {data} = await addPassenger({variables:{firstName, lastName, email, password: encryptPassword}});
                return {state:'success',data:data?.addPassenger};
            }
        }catch(error){
            console.log(error.message);
            return { state:'error', err:error.message };
        }
    }
}

export function useSignIn(){
    const [getDriverByEmail] = useLazyQuery(GET_DRIVER_BY_EMAIL);
    const [getPassengerByEmail] = useLazyQuery(GET_PASSENGER_BY_EMAIL);
    const [getIssuerByEmail] = useLazyQuery(GET_ISSUER_BY_EMAIL);
    const [updateSignedIn] = useMutation(UPDATESIGNEDIN_MUTATION);
    return async function(identity, email, password){
        try{
            if (identity === 'driver') {
                const {error} = await getDriverByEmail({variables:{email}});
                if (error) throw error;
            } else if (identity === "issuer") {
                const {error} = await getIssuerByEmail({variables:{email}});
                if (error) throw error;
            } else if (identity === 'passenger') {
                const {error} = await getPassengerByEmail({variables:{email}});
                if (error) throw error;
            }
            const encryptPassword = AES.encrypt(password, 'NMfinalalalala').toString();
            const {data:result} = await updateSignedIn({variables:{identity, state:true, email,  password:encryptPassword}});
            return {state:'success', result: result?.updateSignedIn};
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

