from enum import Enum, auto


class UserStatus(Enum):
    Active = auto()
    Restricted = auto()


class TransactionStatus(Enum):
    Created = auto()
    WaitingConfirmation = auto()
    Done = auto()
    Rejected = auto()


class ExternalApplicationStatus(Enum):
    Active = auto()
    Restricted = auto()


class Permissions(Enum):
    Transactions = auto()
    UpdateTransactionStatus = auto()
    Users = auto()
    UserToUserTransactions = auto()
