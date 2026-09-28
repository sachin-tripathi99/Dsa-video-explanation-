class Solution:
    def minCameraCover(self, root: Optional[TreeNode]) -> int:
        cameras = 0

        def state(node):                        # 0 needs cover, 1 camera, 2 covered
            nonlocal cameras
            if not node:
                return 2
            l, r = state(node.left), state(node.right)
            if l == 0 or r == 0:
                cameras += 1                    # a child needs us
                return 1
            return 2 if l == 1 or r == 1 else 0

        if state(root) == 0:
            cameras += 1                        # root still uncovered
        return cameras
