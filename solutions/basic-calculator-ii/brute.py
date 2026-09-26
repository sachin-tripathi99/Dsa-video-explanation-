class Solution:
    def calculate(self, s: str) -> int:
        tokens, num = [], ""
        for c in s:
            if c.isdigit():
                num += c
            elif c in "+-*/":
                tokens += [int(num), c]
                num = ""
        tokens.append(int(num))
        terms = [tokens[0]]                     # pass 1: fold × and ÷
        for i in range(1, len(tokens), 2):
            op, n = tokens[i], tokens[i + 1]
            if op == "*":
                terms[-1] *= n
            elif op == "/":
                terms[-1] = int(terms[-1] / n)
            else:
                terms += [op, n]
        total = terms[0]                        # pass 2: + and −
        for i in range(1, len(terms), 2):
            total = total + terms[i + 1] if terms[i] == "+" else total - terms[i + 1]
        return total
