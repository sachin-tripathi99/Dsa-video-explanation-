class MyCircularQueue:
    def __init__(self, k: int):
        self.a = [0] * k
        self.head = 0
        self.size = 0

    def enQueue(self, value: int) -> bool:
        if self.size == len(self.a):
            return False
        self.a[(self.head + self.size) % len(self.a)] = value   # next free slot, wrapping
        self.size += 1
        return True

    def deQueue(self) -> bool:
        if self.size == 0:
            return False
        self.head = (self.head + 1) % len(self.a)
        self.size -= 1
        return True

    def Front(self) -> int:
        return -1 if self.size == 0 else self.a[self.head]

    def Rear(self) -> int:
        return -1 if self.size == 0 else self.a[(self.head + self.size - 1) % len(self.a)]

    def isEmpty(self) -> bool:
        return self.size == 0

    def isFull(self) -> bool:
        return self.size == len(self.a)
