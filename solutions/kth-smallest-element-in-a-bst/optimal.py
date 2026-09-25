class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        st, node = [], root
        while True:
            while node:                  # go far left
                st.append(node)
                node = node.left
            node = st.pop()              # next smallest
            k -= 1
            if k == 0:
                return node.val
            node = node.right
