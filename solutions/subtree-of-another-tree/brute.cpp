class Solution {
    bool same(TreeNode* a, TreeNode* b) {
        if (!a || !b) return a == b;
        return a->val == b->val && same(a->left, b->left) && same(a->right, b->right);
    }
public:
    bool isSubtree(TreeNode* root, TreeNode* subRoot) {
        if (!root) return false;
        return same(root, subRoot) || isSubtree(root->left, subRoot) || isSubtree(root->right, subRoot);
    }
};
