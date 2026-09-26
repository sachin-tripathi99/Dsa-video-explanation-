class Solution {
    public void flatten(TreeNode root) {
        TreeNode cur = root;
        while (cur != null) {
            if (cur.left != null) {
                TreeNode pre = cur.left;
                while (pre.right != null) pre = pre.right;  // rightmost of the left subtree
                pre.right = cur.right;                      // right subtree follows it
                cur.right = cur.left;                       // left subtree moves right
                cur.left = null;
            }
            cur = cur.right;
        }
    }
}
