class Solution:
    def decodeString(self, s: str) -> str:
        while "[" in s:
            close = s.index("]")                # first "]" closes an innermost pair
            open_ = s.rindex("[", 0, close)
            start = open_
            while start > 0 and s[start - 1].isdigit():
                start -= 1
            k = int(s[start:open_])
            s = s[:start] + s[open_ + 1:close] * k + s[close + 1:]
        return s
