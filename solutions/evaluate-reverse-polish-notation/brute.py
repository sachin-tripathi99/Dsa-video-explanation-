class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        t = list(tokens)
        while len(t) > 1:
            i = next(k for k, x in enumerate(t) if x in "+-*/" and len(x) == 1)   # first operator
            a, b = int(t[i - 2]), int(t[i - 1])
            op = t[i]
            r = a + b if op == "+" else a - b if op == "-" else a * b if op == "*" else int(a / b)
            t[i - 2:i + 1] = [str(r)]                       # replace a, b, op with the result
        return int(t[0])
