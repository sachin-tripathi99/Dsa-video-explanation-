class Solution:
    def calculate(self, s: str) -> int:
        result = last = num = 0
        op = "+"
        for i, c in enumerate(s):
            if c.isdigit():
                num = num * 10 + int(c)
            if (not c.isdigit() and c != " ") or i == len(s) - 1:
                if op in "+-":                  # close the previous term
                    result += last
                    last = num if op == "+" else -num
                elif op == "*":                 # × ÷ change the open term
                    last *= num
                else:
                    last = int(last / num)      # truncate toward zero
                op, num = c, 0
        return result + last
