class MyCircularQueue:
    def __init__(self, k: int):
        self.k = k
        self.data = []

    def enQueue(self, value: int) -> bool:
        if len(self.data) == self.k:
            return False
        self.data.append(value)
        return True

    def deQueue(self) -> bool:
        if not self.data:
            return False
        self.data.pop(0)                  # shifts every element
        return True

    def Front(self) -> int:
        return self.data[0] if self.data else -1

    def Rear(self) -> int:
        return self.data[-1] if self.data else -1

    def isEmpty(self) -> bool:
        return not self.data

    def isFull(self) -> bool:
        return len(self.data) == self.k
