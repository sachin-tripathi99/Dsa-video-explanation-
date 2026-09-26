class Solution:
    def simplifyPath(self, path: str) -> str:
        st = []
        for part in path.split("/"):
            if part in ("", "."):
                continue
            if part == "..":
                if st:
                    st.pop()                    # go up one folder
            else:
                st.append(part)
        return "/" + "/".join(st)
