class BSTIterator {
    stack<TreeNode*> st;
    void pushLeft(TreeNode* n) {
        while (n) { st.push(n); n = n->left; }              // the left spine
    }
public:
    BSTIterator(TreeNode* root) { pushLeft(root); }
    int next() {
        TreeNode* n = st.top(); st.pop();                   // next smallest
        pushLeft(n->right);
        return n->val;
    }
    bool hasNext() { return !st.empty(); }
};
