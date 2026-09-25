from collections import deque

class MyStack:
    def __init__(self):
        self.q1, self.q2 = deque(), deque()

    def push(self, x: int) -> None:
        self.q1.append(x)

    def pop(self) -> int:
        while len(self.q1) > 1:                  # move all but the newest
            self.q2.append(self.q1.popleft())
        x = self.q1.popleft()
        self.q1, self.q2 = self.q2, self.q1
        return x

    def top(self) -> int:
        x = self.pop()
        self.push(x)
        return x

    def empty(self) -> bool:
        return not self.q1
