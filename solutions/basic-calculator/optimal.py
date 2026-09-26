class Solution:
    def calculate(self, s: str) -> int:
        result, sign, num = 0, 1, 0
        st = []
        for c in s:
            if c.isdigit():
                num = num * 10 + int(c)
            elif c in "+-":
                result += sign * num
                num = 0
                sign = 1 if c == "+" else -1
            elif c == "(":                      # save the outer context
                st.append((result, sign))
                result, sign = 0, 1
            elif c == ")":                      # combine with it
                result += sign * num
                num = 0
                prev, sg = st.pop()
                result = prev + sg * result
        return result + sign * num
