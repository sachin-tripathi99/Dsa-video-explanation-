class MinStack:
    def __init__(self):
        self.st = []                             # (value, min so far)

    def push(self, val: int) -> None:
        m = min(val, self.st[-1][1]) if self.st else val
        self.st.append((val, m))

    def pop(self) -> None:
        self.st.pop()

    def top(self) -> int:
        return self.st[-1][0]

    def getMin(self) -> int:
        return self.st[-1][1]
