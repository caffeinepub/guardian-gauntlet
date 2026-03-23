import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  type EmergencyContact = {
    name : Text;
    phoneNumber : Text;
  };

  module EmergencyContact {
    public func compare(contact1 : EmergencyContact, contact2 : EmergencyContact) : Order.Order {
      Text.compare(contact1.name, contact2.name);
    };
  };

  var nextId = 0;
  let contacts = Map.empty<Nat, EmergencyContact>();

  public shared ({ caller }) func addContact(name : Text, phoneNumber : Text) : async Nat {
    let id = nextId;
    contacts.add(id, { name; phoneNumber });
    nextId += 1;
    id;
  };

  public shared ({ caller }) func updateContact(id : Nat, contact : EmergencyContact) : async () {
    if (not contacts.containsKey(id)) {
      Runtime.trap("Contact not found.");
    };
    contacts.add(id, contact);
  };

  public shared ({ caller }) func deleteContact(id : Nat) : async () {
    if (not contacts.containsKey(id)) {
      Runtime.trap("Contact not found.");
    };
    contacts.remove(id);
  };

  public query ({ caller }) func getContact(id : Nat) : async EmergencyContact {
    switch (contacts.get(id)) {
      case (null) { Runtime.trap("Contact not found.") };
      case (?contact) { contact };
    };
  };

  public query ({ caller }) func listContacts() : async [EmergencyContact] {
    contacts.values().toArray().sort();
  };
};
