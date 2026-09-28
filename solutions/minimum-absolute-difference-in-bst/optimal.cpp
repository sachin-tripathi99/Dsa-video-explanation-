class Solution {
    int prev = -1, best = INT_MAX;
    bool has = false;
    void inorder(TreeNode* n) {
        if (!n) return;
        inorder(n->left);
        if (has) best = min(best, n->val - prev);           // sorted: compare with the neighbour
        prev = n->val; has = true;
        inorder(n->right);
    }
public:
    int getMinimumDifference(TreeNode* root) {
        inorder(root);
        return best;
    }
};
