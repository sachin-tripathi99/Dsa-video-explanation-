class Solution:
    def pathSum(self, root: Optional[TreeNode], targetSum: int) -> List[List[int]]:
        paths = []

        def collect(n, path):
            if not n:
                return
            path = path + [n.val]
            if not n.left and not n.right:
                paths.append(path)              # every leaf path
            collect(n.left, path)
            collect(n.right, path)

        collect(root, [])
        return [p for p in paths if sum(p) == targetSum]
