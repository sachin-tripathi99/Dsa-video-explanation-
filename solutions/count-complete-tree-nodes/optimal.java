class Solution {
    public int countNodes(TreeNode root) {
        if (root == null) return 0;
        int lh = 0, rh = 0;
        for (TreeNode n = root; n != null; n = n.left) lh++;
        for (TreeNode n = root; n != null; n = n.right) rh++;
        if (lh == rh) return (1 << lh) - 1;                    // perfect subtree
        return 1 + countNodes(root.left) + countNodes(root.right);
    }
}
