enum status { READY, BUSY } /// ready/busy
enum userType {operator, user} //// operator/user

export interface IWelcomeMessage {
    userToken: string;
    idUser: string;
    status: status;
    userType: userType; 
}
