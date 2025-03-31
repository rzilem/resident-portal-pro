import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  BankAccount, 
  BankStatement, 
  BankTransaction, 
  GLAccount,
  JournalEntry,
  LedgerEntry,
  FinancialSummary
} from "@/types/accounting";

class AccountingLedgerService {
  /**
   * Fetch all bank accounts for an association
   */
  async getBankAccounts(associationId: string): Promise<BankAccount[]> {
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('association_id', associationId)
        .order('name');
      
      if (error) {
        console.error('Error fetching bank accounts:', error);
        return [];
      }
      
      return data.map(account => ({
        id: account.id,
        associationId: account.association_id,
        name: account.name,
        accountType: account.account_type,
        accountNumber: account.account_number,
        routingNumber: account.routing_number,
        balance: Number(account.balance),
        isActive: account.is_active,
        notes: account.notes,
        createdAt: account.created_at,
        updatedAt: account.updated_at
      }));
    } catch (error) {
      console.error('Unexpected error fetching bank accounts:', error);
      return [];
    }
  }

  /**
   * Create a new bank account
   */
  async createBankAccount(account: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<BankAccount | null> {
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .insert({
          association_id: account.associationId,
          name: account.name,
          account_type: account.accountType,
          account_number: account.accountNumber,
          routing_number: account.routingNumber,
          balance: account.balance,
          is_active: account.isActive,
          notes: account.notes
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating bank account:', error);
        toast.error('Failed to create bank account');
        return null;
      }
      
      toast.success('Bank account created successfully');
      return {
        id: data.id,
        associationId: data.association_id,
        name: data.name,
        accountType: data.account_type,
        accountNumber: data.account_number,
        routingNumber: data.routing_number,
        balance: Number(data.balance),
        isActive: data.is_active,
        notes: data.notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Unexpected error creating bank account:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  }

  /**
   * Update a bank account
   */
  async updateBankAccount(id: string, account: Partial<BankAccount>): Promise<boolean> {
    try {
      const updateData: any = {};
      
      if (account.name) updateData.name = account.name;
      if (account.accountType) updateData.account_type = account.accountType;
      if (account.accountNumber) updateData.account_number = account.accountNumber;
      if (account.routingNumber) updateData.routing_number = account.routingNumber;
      if (account.balance !== undefined) updateData.balance = account.balance;
      if (account.isActive !== undefined) updateData.is_active = account.isActive;
      if (account.notes !== undefined) updateData.notes = account.notes;
      
      const { error } = await supabase
        .from('bank_accounts')
        .update(updateData)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating bank account:', error);
        toast.error('Failed to update bank account');
        return false;
      }
      
      toast.success('Bank account updated successfully');
      return true;
    } catch (error) {
      console.error('Unexpected error updating bank account:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  }

  /**
   * Get bank account by ID
   */
  async getBankAccountById(id: string): Promise<BankAccount | null> {
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching bank account:', error);
        return null;
      }
      
      return {
        id: data.id,
        associationId: data.association_id,
        name: data.name,
        accountType: data.account_type,
        accountNumber: data.account_number,
        routingNumber: data.routing_number,
        balance: Number(data.balance),
        isActive: data.is_active,
        notes: data.notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Unexpected error fetching bank account:', error);
      return null;
    }
  }

  /**
   * Get transactions for a bank account
   */
  async getBankTransactions(bankAccountId: string, options?: { 
    limit?: number, 
    startDate?: string, 
    endDate?: string 
  }): Promise<BankTransaction[]> {
    try {
      let query = supabase
        .from('bank_transactions')
        .select('*')
        .eq('bank_account_id', bankAccountId)
        .order('transaction_date', { ascending: false });
      
      if (options?.startDate) {
        query = query.gte('transaction_date', options.startDate);
      }
      
      if (options?.endDate) {
        query = query.lte('transaction_date', options.endDate);
      }
      
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching bank transactions:', error);
        return [];
      }
      
      return data.map(tx => ({
        id: tx.id,
        associationId: tx.association_id,
        bankAccountId: tx.bank_account_id,
        transactionDate: tx.transaction_date,
        amount: Number(tx.amount),
        description: tx.description,
        transactionType: tx.transaction_type,
        checkNumber: tx.check_number,
        status: tx.status,
        isReconciled: tx.is_reconciled,
        statementId: tx.statement_id,
        createdAt: tx.created_at,
        updatedAt: tx.updated_at
      }));
    } catch (error) {
      console.error('Unexpected error fetching bank transactions:', error);
      return [];
    }
  }

  /**
   * Create a new bank transaction
   */
  async createBankTransaction(transaction: Omit<BankTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<BankTransaction | null> {
    try {
      const { data, error } = await supabase
        .from('bank_transactions')
        .insert({
          association_id: transaction.associationId,
          bank_account_id: transaction.bankAccountId,
          transaction_date: transaction.transactionDate,
          amount: transaction.amount,
          description: transaction.description,
          transaction_type: transaction.transactionType,
          check_number: transaction.checkNumber,
          status: transaction.status,
          is_reconciled: transaction.isReconciled,
          statement_id: transaction.statementId
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating bank transaction:', error);
        toast.error('Failed to create bank transaction');
        return null;
      }
      
      // Update the bank account balance
      await this.updateAccountBalance(transaction.bankAccountId);
      
      toast.success('Transaction recorded successfully');
      return {
        id: data.id,
        associationId: data.association_id,
        bankAccountId: data.bank_account_id,
        transactionDate: data.transaction_date,
        amount: Number(data.amount),
        description: data.description,
        transactionType: data.transaction_type,
        checkNumber: data.check_number,
        status: data.status,
        isReconciled: data.is_reconciled,
        statementId: data.statement_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Unexpected error creating bank transaction:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  }

  /**
   * Create a journal entry
   */
  async createJournalEntry(entry: {
    associationId: string;
    date: string;
    reference: string;
    description: string;
    lines: Array<{
      glAccountId: string;
      debit?: number;
      credit?: number;
      description?: string;
    }>;
  }): Promise<string | null> {
    try {
      // First create the journal entry
      const { data: journalData, error: journalError } = await supabase
        .from('journal_entries')
        .insert({
          association_id: entry.associationId,
          entry_date: entry.date,
          reference: entry.reference,
          description: entry.description,
          status: 'draft',
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (journalError) {
        console.error('Error creating journal entry:', journalError);
        toast.error('Failed to create journal entry');
        return null;
      }
      
      // Then create all the ledger entries
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      
      const ledgerEntries = entry.lines.map(line => {
        const isDebit = !!line.debit && line.debit > 0;
        return {
          association_id: entry.associationId,
          gl_account_id: line.glAccountId,
          transaction_date: entry.date,
          entry_type: isDebit ? 'debit' : 'credit',
          amount: isDebit ? line.debit! : line.credit!,
          description: line.description || entry.description,
          reference_number: entry.reference,
          journal_entry_id: journalData.id,
          created_by: userId
        };
      });
      
      const { error: linesError } = await supabase
        .from('ledger_entries')
        .insert(ledgerEntries);
      
      if (linesError) {
        console.error('Error creating ledger entries:', linesError);
        toast.error('Failed to create ledger entries');
        
        // If we fail to create the lines, delete the journal entry
        await supabase
          .from('journal_entries')
          .delete()
          .eq('id', journalData.id);
          
        return null;
      }
      
      toast.success('Journal entry created successfully');
      return journalData.id;
    } catch (error) {
      console.error('Unexpected error creating journal entry:', error);
      toast.error('An unexpected error occurred');
      return null;
    }
  }

  /**
   * Post a journal entry
   */
  async postJournalEntry(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .update({
          status: 'posted',
          posted_date: new Date().toISOString(),
          posted_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error posting journal entry:', error);
        toast.error('Failed to post journal entry');
        return false;
      }
      
      toast.success('Journal entry posted successfully');
      return true;
    } catch (error) {
      console.error('Unexpected error posting journal entry:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  }

  /**
   * Get financial summary for an association
   */
  async getFinancialSummary(associationId: string): Promise<FinancialSummary> {
    try {
      // Get bank account balances
      const { data: accountsData, error: accountsError } = await supabase
        .from('bank_accounts')
        .select('id, account_type, balance')
        .eq('association_id', associationId);
      
      if (accountsError) {
        console.error('Error fetching bank accounts:', accountsError);
        return this.getDefaultFinancialSummary();
      }
      
      // Calculate balances by account type
      let operatingBalance = 0;
      let reserveBalance = 0;
      let otherBalance = 0;
      
      accountsData.forEach(account => {
        const balance = Number(account.balance);
        switch (account.account_type) {
          case 'operating':
            operatingBalance += balance;
            break;
          case 'reserve':
            reserveBalance += balance;
            break;
          default:
            otherBalance += balance;
            break;
        }
      });
      
      // Get current month's income and expenses
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
      
      // Get year-to-date income and expenses
      const firstDayOfYear = new Date(now.getFullYear(), 0, 1).toISOString();
      
      // Get monthly income (current month)
      const { data: monthlyIncomeData, error: monthlyIncomeError } = await supabase
        .from('ledger_entries')
        .select('amount')
        .eq('association_id', associationId)
        .eq('entry_type', 'credit')
        .gte('transaction_date', firstDayOfMonth)
        .lte('transaction_date', lastDayOfMonth)
        .in('gl_account_id', await this.getIncomeAccountIds(associationId));
      
      // Get monthly expenses (current month)
      const { data: monthlyExpensesData, error: monthlyExpensesError } = await supabase
        .from('ledger_entries')
        .select('amount')
        .eq('association_id', associationId)
        .eq('entry_type', 'debit')
        .gte('transaction_date', firstDayOfMonth)
        .lte('transaction_date', lastDayOfMonth)
        .in('gl_account_id', await this.getExpenseAccountIds(associationId));
      
      // Get YTD income
      const { data: ytdIncomeData, error: ytdIncomeError } = await supabase
        .from('ledger_entries')
        .select('amount')
        .eq('association_id', associationId)
        .eq('entry_type', 'credit')
        .gte('transaction_date', firstDayOfYear)
        .in('gl_account_id', await this.getIncomeAccountIds(associationId));
      
      // Get YTD expenses
      const { data: ytdExpensesData, error: ytdExpensesError } = await supabase
        .from('ledger_entries')
        .select('amount')
        .eq('association_id', associationId)
        .eq('entry_type', 'debit')
        .gte('transaction_date', firstDayOfYear)
        .in('gl_account_id', await this.getExpenseAccountIds(associationId));
      
      // Sum up the values
      const monthlyIncome = monthlyIncomeError ? 0 : monthlyIncomeData.reduce((sum, item) => sum + Number(item.amount), 0);
      const monthlyExpenses = monthlyExpensesError ? 0 : monthlyExpensesData.reduce((sum, item) => sum + Number(item.amount), 0);
      const yearToDateIncome = ytdIncomeError ? 0 : ytdIncomeData.reduce((sum, item) => sum + Number(item.amount), 0);
      const yearToDateExpenses = ytdExpensesError ? 0 : ytdExpensesData.reduce((sum, item) => sum + Number(item.amount), 0);
      
      return {
        operatingBalance,
        reserveBalance,
        otherBalance,
        totalAssets: operatingBalance + reserveBalance + otherBalance,
        totalLiabilities: 0, // This would need more complex calculation
        monthlyIncome,
        monthlyExpenses,
        yearToDateIncome,
        yearToDateExpenses
      };
    } catch (error) {
      console.error('Unexpected error getting financial summary:', error);
      return this.getDefaultFinancialSummary();
    }
  }
  
  /**
   * Helper to get default financial summary
   */
  private getDefaultFinancialSummary(): FinancialSummary {
    return {
      operatingBalance: 0,
      reserveBalance: 0,
      otherBalance: 0,
      totalAssets: 0,
      totalLiabilities: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      yearToDateIncome: 0,
      yearToDateExpenses: 0
    };
  }
  
  /**
   * Helper to get income account IDs
   */
  private async getIncomeAccountIds(associationId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('gl_accounts')
      .select('id')
      .eq('association_id', associationId)
      .eq('type', 'Income');
      
    if (error || !data) return [];
    return data.map(a => a.id);
  }
  
  /**
   * Helper to get expense account IDs
   */
  private async getExpenseAccountIds(associationId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('gl_accounts')
      .select('id')
      .eq('association_id', associationId)
      .eq('type', 'Expense');
      
    if (error || !data) return [];
    return data.map(a => a.id);
  }
  
  /**
   * Update account balance based on transactions
   */
  private async updateAccountBalance(accountId: string): Promise<void> {
    try {
      // Get the sum of all deposits
      const { data: depositsData, error: depositsError } = await supabase
        .from('bank_transactions')
        .select('amount')
        .eq('bank_account_id', accountId)
        .in('transaction_type', ['deposit', 'transfer']);
      
      // Get the sum of all withdrawals
      const { data: withdrawalsData, error: withdrawalsError } = await supabase
        .from('bank_transactions')
        .select('amount')
        .eq('bank_account_id', accountId)
        .in('transaction_type', ['withdrawal', 'payment', 'fee']);
      
      if (depositsError || withdrawalsError) {
        console.error('Error calculating account balance:', depositsError || withdrawalsError);
        return;
      }
      
      // Calculate the new balance
      const depositSum = depositsData.reduce((sum, item) => sum + Number(item.amount), 0);
      const withdrawalSum = withdrawalsData.reduce((sum, item) => sum + Number(item.amount), 0);
      const newBalance = depositSum - withdrawalSum;
      
      // Update the account balance
      await supabase
        .from('bank_accounts')
        .update({ balance: newBalance })
        .eq('id', accountId);
    } catch (error) {
      console.error('Unexpected error updating account balance:', error);
    }
  }
}

export const accountingLedgerService = new AccountingLedgerService();
