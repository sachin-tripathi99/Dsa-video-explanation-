class Solution:
    def isIsomorphic(self, s: str, t: str) -> bool:
        st, ts = {}, {}
        for a, b in zip(s, t):
            if st.get(a, b) != b or ts.get(b, a) != a:   # conflict in either direction
                return False
            st[a] = b
            ts[b] = a
        return True
