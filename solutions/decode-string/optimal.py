class Solution:
    def decodeString(self, s: str) -> str:
        stack = []
        cur, k = "", 0
        for c in s:
            if c.isdigit():
                k = k * 10 + int(c)
            elif c == "[":                      # save the outer context
                stack.append((cur, k))
                cur, k = "", 0
            elif c == "]":                      # combine with the saved context
                prev, n = stack.pop()
                cur = prev + cur * n
            else:
                cur += c
        return cur
