import { useState } from 'react'
import { Button, CircularProgress, Typography } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import SchoolIcon from '@mui/icons-material/School'
import { useParents } from '../../hooks/useParents'
import { CreateParentModal } from '../../components/CreateParentModal/CreateParentModal'
import { AddStudentModal } from '../../components/AddStudentModal/AddStudentModal'
import type { ParentResponse } from '../../types/parent.types'
import styles from './ParentsListPage.module.scss'

export const ParentsListPage = () => {
  const { data: parents, isLoading } = useParents()
  const [createParentOpen, setCreateParentOpen] = useState(false)
  const [selectedParent, setSelectedParent] = useState<ParentResponse | null>(null)

  const initials = (firstName: string, lastName: string) =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Typography className={styles.title}>Родители</Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setCreateParentOpen(true)}
        >
          Нов родител
        </Button>
      </div>

      {isLoading ? (
        <div className={styles.loadingWrapper}>
          <CircularProgress />
        </div>
      ) : !parents || parents.length === 0 ? (
        <div className={styles.empty}>Няма добавени родители все още.</div>
      ) : (
        <div className={styles.list}>
          {parents.map((parent) => (
            <div key={parent.id} className={styles.card}>
              <div className={styles.avatar}>
                {initials(parent.firstName, parent.lastName)}
              </div>

              <div className={styles.info}>
                <div className={styles.name}>{parent.firstName} {parent.lastName}</div>
                <div className={styles.email}>{parent.email}</div>
              </div>

              <Button
                variant="outlined"
                size="small"
                startIcon={<SchoolIcon fontSize="small" />}
                onClick={() => setSelectedParent(parent)}
              >
                Добави ученик
              </Button>
            </div>
          ))}
        </div>
      )}

      <CreateParentModal
        open={createParentOpen}
        onClose={() => setCreateParentOpen(false)}
      />

      {selectedParent && (
        <AddStudentModal
          parent={selectedParent}
          open={true}
          onClose={() => setSelectedParent(null)}
        />
      )}
    </div>
  )
}
