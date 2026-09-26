class Solution:
    def removeKdigits(self, num: str, k: int) -> str:
        st = []                                 # increasing stack
        for c in num:
            while k and st and st[-1] > c:
                st.pop()                        # remove a peak
                k -= 1
            st.append(c)
        if k:
            st = st[:-k]                        # leftover removals from the end
        return "".join(st).lstrip("0") or "0"
