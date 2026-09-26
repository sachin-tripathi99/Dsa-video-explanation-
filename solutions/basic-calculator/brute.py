class Solution:
    def calculate(self, s: str) -> int:
        i = 0

        def evaluate():                         # evaluates until ")" or the end
            nonlocal i
            result, sign = 0, 1
            while i < len(s):
                c = s[i]
                if c.isdigit():
                    num = 0
                    while i < len(s) and s[i].isdigit():
                        num = num * 10 + int(s[i])
                        i += 1
                    result += sign * num
                    continue
                i += 1
                if c == "+":
                    sign = 1
                elif c == "-":
                    sign = -1
                elif c == "(":
                    result += sign * evaluate() # recurse into the bracket
                elif c == ")":
                    return result
            return result

        return evaluate()
