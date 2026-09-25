class Solution {
    void inorder(TreeNode* n, vector<int>& out) {
        if (!n) return;
        inorder(n->left, out);
        out.push_back(n->val);
        inorder(n->right, out);
    }
public:
    int kthSmallest(TreeNode* root, int k) {
        vector<int> vals;
        inorder(root, vals);
        return vals[k - 1];
    }
};
