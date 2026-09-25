class Solution:
    def isValid(self, s: str) -> bool:
        partner = {")": "(", "]": "[", "}": "{"}
        st = []
        for c in s:
            if c not in partner:
                st.append(c)
            elif not st or st.pop() != partner[c]:   # empty or mismatched
                return False
        return not st                                # leftovers are unclosed
