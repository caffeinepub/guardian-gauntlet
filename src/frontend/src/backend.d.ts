import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface EmergencyContact {
    name: string;
    phoneNumber: string;
}
export interface backendInterface {
    addContact(name: string, phoneNumber: string): Promise<bigint>;
    deleteContact(id: bigint): Promise<void>;
    getContact(id: bigint): Promise<EmergencyContact>;
    listContacts(): Promise<Array<EmergencyContact>>;
    updateContact(id: bigint, contact: EmergencyContact): Promise<void>;
}
