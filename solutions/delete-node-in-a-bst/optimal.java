class Solution {
    public TreeNode deleteNode(TreeNode root, int key) {
        if (root == null) return null;
        if (key < root.val) root.left = deleteNode(root.left, key);
        else if (key > root.val) root.right = deleteNode(root.right, key);
        else {
            if (root.left == null) return root.right;       // 0 or 1 child
            if (root.right == null) return root.left;
            TreeNode s = root.right;
            while (s.left != null) s = s.left;              // in-order successor
            root.val = s.val;
            root.right = deleteNode(root.right, s.val);
        }
        return root;
    }
}
