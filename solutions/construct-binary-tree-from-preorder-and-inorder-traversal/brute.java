class Solution {
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        if (preorder.length == 0) return null;
        TreeNode root = new TreeNode(preorder[0]);
        int m = 0;
        while (inorder[m] != preorder[0]) m++;              // linear search for the root
        root.left = buildTree(Arrays.copyOfRange(preorder, 1, m + 1), Arrays.copyOfRange(inorder, 0, m));
        root.right = buildTree(Arrays.copyOfRange(preorder, m + 1, preorder.length), Arrays.copyOfRange(inorder, m + 1, inorder.length));
        return root;
    }
}
