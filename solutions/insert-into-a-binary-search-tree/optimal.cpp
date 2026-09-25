class Solution {
public:
    TreeNode* insertIntoBST(TreeNode* root, int val) {
        TreeNode* node = new TreeNode(val);
        if (!root) return node;
        TreeNode* cur = root;
        while (true) {
            TreeNode*& side = val < cur->val ? cur->left : cur->right;
            if (!side) { side = node; return root; }
            cur = side;
        }
    }
};
